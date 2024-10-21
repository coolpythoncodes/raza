// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Contest} from "./Contest.sol";

contract ContestFactory {
    address[] private s_deployedContests;

    // Events
    event ContestCreated(
        string title, string description, address organizer, uint256 entryPeriodStart, uint256 entryPeriodEnd
    );

    // Errors
    error ContestFactory__EntryStartTimeMustBeInTheFuture();
    error ContestFactory__EntryEndTimeMustBeAfterStartTime();
    error ContestFactory__VotingEndTimeMustBeAfterStartTime();

    function createContest(
        string calldata title,
        string calldata description,
        uint256 entryStartTime,
        uint256 entryEndTime,
        uint256 votingStartTime,
        uint256 votingEndTime,
        uint256 numAllowedEntrySubmissions,
        uint256 maxTotalEntries,
        uint256 numberOfWinners
    ) external returns (address) {
        _validateContestTimings(entryStartTime, entryEndTime, votingStartTime, votingEndTime);

        Contest newContest = new Contest(
            title,
            description,
            entryStartTime,
            entryEndTime,
            votingStartTime,
            votingEndTime,
            msg.sender,
            numAllowedEntrySubmissions,
            maxTotalEntries,
            numberOfWinners
        );

        s_deployedContests.push(address(newContest));

        return address(newContest);
    }

    function getDeployedContests() external view returns (address[] memory) {
        return s_deployedContests;
    }

    /**
     * @dev Validates the timing parameters for creating a contest.
     * @param entryStartTime The start time for contest entries (Unix timestamp).
     * @param entryEndTime The end time for contest entries (Unix timestamp).
     * @param votingStartTime The start time for voting (Unix timestamp).
     * @param votingEndTime The end time for voting (Unix timestamp).
     */
    function _validateContestTimings(
        uint256 entryStartTime,
        uint256 entryEndTime,
        uint256 votingStartTime,
        uint256 votingEndTime
    ) internal view {
        // Entry start time must be in the future
        if (entryStartTime < block.timestamp) {
            revert ContestFactory__EntryStartTimeMustBeInTheFuture();
        }

        // Entry end time must be after the entry start time
        if (entryEndTime <= entryStartTime) {
            revert ContestFactory__EntryEndTimeMustBeAfterStartTime();
        }

        // Voting end time must be after the voting start time
        if (votingEndTime <= votingStartTime) {
            revert ContestFactory__VotingEndTimeMustBeAfterStartTime();
        }
    }
}

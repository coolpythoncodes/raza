// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
/**
 * @title Contest Contract
 * @notice This contract manages a contest with an entry period, voting period, and participant entries.
 * @dev The contract is owned by the organizer and allows participants to submit entries during the entry period.
 */

contract Contest is Ownable {
    struct ParticipantEntry {
        address participant;
        string content;
        bool exists;
        uint256 numberOfVotes;
    }

    struct ContestDetails {
        string title;
        string description;
        uint256 entryStartTime;
        uint256 entryEndTime;
        uint256 votingStartTime;
        uint256 votingEndTime;
        address organizer;
        uint256 maxTotalEntries;
        uint256 maxEntriesPerParticipant;
    }

    string public s_title;
    string public s_description;
    uint256 public s_entryStartTime;
    uint256 public s_entryEndTime;
    uint256 public s_votingStartTime;
    uint256 public s_votingEndTime;
    address public s_organizer;
    uint256 public s_maxTotalEntries;

    uint256[] public s_allEntryIds; // IDs of all entries submitted by participants
    uint256[] public s_deletedEntryIds;
    uint256 public s_maxEntriesPerParticipant;

    mapping(address => uint256) public s_participantEntryCount;
    mapping(uint256 => ParticipantEntry) private s_entry;
    mapping(address => mapping(uint256 => bool)) private s_hasVoted;

    bool public s_isCanceled;
    uint256 public s_totalVotes;

    enum ContestStatus {
        Inactive, // Contest is not yet open for participants or not started
        OpenForParticipants, // Contest is open for participants to join
        VotingStarted, // Voting has started for the contest
        Canceled, // Contest has been canceled
        Ended // Contest has ended after voting
    }

    // Events
    event Contest__ContestCanceled();
    event Contest__EntrySubmitted(
        uint256 entryId,
        address participant,
        string entry
    );
    event EntryDeleted(uint256 entryId);
    event VoteCast(address voter, uint256 entryId);

    // Errors
    error Contest__AlreadyCanceled();
    error Contest__NotOrganizer();
    error Contest__ExceededEntryLimit(uint256 numAllowedEntrySubmissions);
    error Contest__NotOpenForParticipants();
    error Contest__ExceededTotalMaxEntryLimit(uint256 maxTotalEntries);
    error Contest__EntryAlreadyExists();
    error Contest__CannotDeleteEntryAfterContestEndedOrCanceled();
    error Contest__NotInVotingPhase();
    error Contest__InvalidOrDeletedEntry(uint256 entryId);
    error Contest__AlreadyVotedForEntry();

    /**
     * @notice Initializes the Contest contract with the given parameters.
     * @param title The title of the contest.
     * @param description A description of the contest.
     * @param entryStartTime The start time for the entry period (Unix timestamp).
     * @param entryEndTime The end time for the entry period (Unix timestamp).
     * @param votingStartTime The start time for the voting period (Unix timestamp).
     * @param votingEndTime The end time for the voting period (Unix timestamp).
     * @param organizer The address of the contest organizer.
     * @param maxEntriesPerParticipant The maximum number of entries a participant can submit.
     * @param maxTotalEntries The maximum total number of entries allowed in the contest.
     */
    constructor(
        string memory title,
        string memory description,
        uint256 entryStartTime,
        uint256 entryEndTime,
        uint256 votingStartTime,
        uint256 votingEndTime,
        address organizer,
        uint256 maxEntriesPerParticipant,
        uint256 maxTotalEntries
    ) Ownable(organizer) {
        s_title = title;
        s_description = description;
        s_entryStartTime = entryStartTime;
        s_entryEndTime = entryEndTime;
        s_votingStartTime = votingStartTime;
        s_votingEndTime = votingEndTime;
        s_organizer = organizer;
        s_maxTotalEntries = maxTotalEntries;
        s_maxEntriesPerParticipant = maxEntriesPerParticipant;
    }

    /**
     * @notice Cancels the contest, preventing further actions.
     * @dev Only the organizer can cancel the contest.
     */
    function cancelContest() external onlyOwner {
        // if (msg.sender != s_organizer) {
        //     revert Contest__NotOrganizer();
        // }

        if (s_isCanceled) {
            revert Contest__AlreadyCanceled();
        }
        s_isCanceled = true;
    }

    /**
     * @notice Submits an entry for the contest.
     * @param content The content of the entry.
     * @return The ID of the submitted entry.
     */
    function submitEntry(string calldata content) external returns (uint256) {
        return _submitEntry(content);
    }

    /**
     * @notice Deletes an entry by its ID.
     * @dev Only the contract owner can delete entries.
     * @param entryId The ID of the entry to delete.
     */
    function deleteEntry(uint256 entryId) external onlyOwner {
        ContestStatus status = getContestStatus();
        if (status == ContestStatus.Ended || status == ContestStatus.Canceled) {
            revert Contest__CannotDeleteEntryAfterContestEndedOrCanceled();
        }

        s_entry[entryId].exists = false;
        s_deletedEntryIds.push(entryId);
        emit EntryDeleted(entryId);
    }

    function getEntry(
        uint256 entryId
    ) public view returns (ParticipantEntry memory entry) {
        return s_entry[entryId];
    }

    /**
     * @notice Returns the current status of the contest.
     * @return The current status as a `ContestStatus` enum value.
     */
    function getContestStatus() public view returns (ContestStatus) {
        if (s_isCanceled) {
            return ContestStatus.Canceled;
        }

        if (block.timestamp < s_entryStartTime) {
            return ContestStatus.Inactive; // Contest has not started yet
        }

        if (
            block.timestamp >= s_entryStartTime &&
            block.timestamp <= s_entryEndTime
        ) {
            return ContestStatus.OpenForParticipants; // Contest is open for participants to join
        }

        if (
            block.timestamp > s_entryEndTime &&
            block.timestamp >= s_votingStartTime &&
            block.timestamp <= s_votingEndTime
        ) {
            return ContestStatus.VotingStarted; // Voting has started
        }

        if (block.timestamp > s_votingEndTime) {
            return ContestStatus.Ended; // Contest has ended after the voting period
        }

        // Default to inactive if none of the conditions match (shouldn't reach here if conditions are correct)
        return ContestStatus.Inactive;
    }

    /**
     * @notice Retrieves the list of IDs for all deleted entries.
     * @dev This function returns an array of entry IDs that have been marked as deleted.
     * It can be useful for tracking entries that have been removed.
     * @return An array of `uint256` representing the IDs of deleted entries.
     */
    function getDeletedEntryIDs() external view returns (uint256[] memory) {
        return s_deletedEntryIds;
    }

    /**
     * @notice Retrieves the contest details including title, description, timings, organizer, maximium total entries and maximium entries per participant.
     * @return A `ContestDetails` struct with the contest's title, description, entry/voting timeframes,organizer, maximium total entries and maximium entries per participant.
     */
    function getContestDetails() external view returns (ContestDetails memory) {
        return
            ContestDetails({
                title: s_title,
                description: s_description,
                entryStartTime: s_entryStartTime,
                entryEndTime: s_entryEndTime,
                votingStartTime: s_votingStartTime,
                votingEndTime: s_votingEndTime,
                organizer: s_organizer,
                maxTotalEntries: s_maxTotalEntries,
                maxEntriesPerParticipant: s_maxEntriesPerParticipant
            });
    }

    /**
     * @notice Retrieves the list of IDs for all entries submitted to the contest.
     * @dev This function returns an array of entry IDs, including both active and deleted entries.
     * It can be used to get an overview of all entries ever submitted to the contest.
     * @return An array of `uint256` representing the IDs of all entries.
     */
    function getAllEntryIds() external view returns (uint256[] memory) {
        return s_allEntryIds;
    }

    /**
     * @dev Generates a unique entry ID based on the content and participant address.
     * @param content The content of the entry.
     * @param participant The address of the participant.
     * @return A unique entry ID as a `uint256`.
     */
    function _generateEntryId(
        string calldata content,
        address participant
    ) internal pure returns (uint256) {
        return uint256(keccak256(abi.encode(participant, content)));
    }

    /**
     * @dev Internal function to handle entry submission.
     * @param content The content of the entry.
     * @return The ID of the submitted entry.
     */
    function _submitEntry(string calldata content) internal returns (uint256) {
        // Check if the contest is open for participants
        ContestStatus status = getContestStatus();
        if (status != ContestStatus.OpenForParticipants) {
            revert Contest__NotOpenForParticipants();
        }

        if (s_participantEntryCount[msg.sender] >= s_maxEntriesPerParticipant) {
            revert Contest__ExceededEntryLimit(s_maxEntriesPerParticipant);
        }

        if (
            (s_allEntryIds.length - s_deletedEntryIds.length) >=
            s_maxTotalEntries
        ) {
            revert Contest__ExceededTotalMaxEntryLimit(s_maxTotalEntries);
        }

        uint256 entryId = _generateEntryId(content, msg.sender);

        if (s_entry[entryId].exists) {
            revert Contest__EntryAlreadyExists();
        }

        s_entry[entryId] = ParticipantEntry({
            participant: msg.sender,
            content: content,
            exists: true,
            numberOfVotes: 0
        });

        s_participantEntryCount[msg.sender]++;
        s_allEntryIds.push(entryId);

        emit Contest__EntrySubmitted(entryId, msg.sender, content);
        return entryId;
    }

    function _vote(uint256 entryId) internal {
        ContestStatus status = getContestStatus();
        if (status != ContestStatus.VotingStarted) {
            revert Contest__NotInVotingPhase();
        }

        ParticipantEntry memory entry = getEntry(entryId);
        if (entry.participant == address(0) || !entry.exists) {
            revert Contest__InvalidOrDeletedEntry(entryId);
        }

        if (s_hasVoted[msg.sender][entryId]) {
            revert Contest__AlreadyVotedForEntry();
        }

        s_hasVoted[msg.sender][entryId] = true;
        s_totalVotes++;
        s_entry[entryId].numberOfVotes++;

        emit VoteCast(msg.sender, entryId);
    }
}

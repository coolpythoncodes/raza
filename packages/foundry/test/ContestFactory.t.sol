// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {ContestFactory} from "../src/ContestFactory.sol";
import {DeployContestFactory} from "../script/DeployContestFactory.s.sol";
import {Constants} from "./Constants.sol";
import {Contest} from "../src/Contest.sol";

contract ContestFactoryTest is Test {
    ContestFactory public contest;
    DeployContestFactory public deployer;

    address organizer = makeAddr("organizer");

    function setUp() public {
        deployer = new DeployContestFactory();
        contest = deployer.run();
    }

    function testCreateContestSuccessfully() public {
        vm.startPrank(organizer);
        address newContest = contest.createContest(
            Constants.CONTEST_TITLE,
            Constants.CONTEST_DESCRIPTION,
            block.timestamp,
            block.timestamp + 1 days,
            block.timestamp + 2 days,
            block.timestamp + 3 days,
            Constants.CONTEST_MAX_ENTRIES_PER_PARTICIPANT,
            Constants.CONTEST_MAX_TOTAL_ENTRIES,
            Constants.CONTEST_NUMBER_OF_WINNERS
        );
        vm.stopPrank();

        address[] memory deployedContestArray = contest.getDeployedContests();

        assertEq(deployedContestArray.length, 1);
        assertEq(deployedContestArray[0], newContest);
        assertTrue(newContest != address(0));
    }

    function testDeployedContestIsInitializedCorrectly() public {
        vm.startPrank(organizer);
        // Create a new contest
        address newContestAddress = contest.createContest(
            Constants.CONTEST_TITLE,
            Constants.CONTEST_DESCRIPTION,
            block.timestamp,
            block.timestamp + 1 days,
            block.timestamp + 2 days,
            block.timestamp + 3 days,
            Constants.CONTEST_MAX_ENTRIES_PER_PARTICIPANT,
            Constants.CONTEST_MAX_TOTAL_ENTRIES,
            Constants.CONTEST_NUMBER_OF_WINNERS
        );
        vm.stopPrank();
        // Cast the new contest address to a Contest instance
        Contest newContest = Contest(newContestAddress);

        // Verify that the contest details are correctly initialized
        assertEq(newContest.s_title(), Constants.CONTEST_TITLE, "Contest title should match");
        assertEq(newContest.s_description(), Constants.CONTEST_DESCRIPTION, "Contest description should match");
        assertEq(newContest.s_organizer(), organizer, "Organizer should be the address that created the contest");
        assertEq(newContest.s_isCanceled(), false, "Contest should not be canceled initially");

        assertEq(newContest.s_maxEntriesPerParticipant(), Constants.CONTEST_MAX_ENTRIES_PER_PARTICIPANT);
        assertEq(newContest.s_maxTotalEntries(), Constants.CONTEST_MAX_TOTAL_ENTRIES);
    }

    function testRevertIfEntryStartTimeInPast() public {
        vm.expectRevert(ContestFactory.ContestFactory__EntryStartTimeMustBeInTheFuture.selector);

        vm.startPrank(organizer);
        // Create a new contest
        contest.createContest(
            Constants.CONTEST_TITLE,
            Constants.CONTEST_DESCRIPTION,
            block.timestamp - 1,
            block.timestamp + 1 days,
            block.timestamp + 2 days,
            block.timestamp + 3 days,
            Constants.CONTEST_MAX_ENTRIES_PER_PARTICIPANT,
            Constants.CONTEST_MAX_TOTAL_ENTRIES,
            Constants.CONTEST_NUMBER_OF_WINNERS
        );
        vm.stopPrank();
    }

    function testRevertIfEntryEndTimeBeforeEntryStartTime() public {
        vm.expectRevert(ContestFactory.ContestFactory__EntryEndTimeMustBeAfterStartTime.selector);
        contest.createContest(
            Constants.CONTEST_TITLE,
            Constants.CONTEST_DESCRIPTION,
            block.timestamp + 2 days,
            block.timestamp,
            block.timestamp + 3 days,
            block.timestamp + 4 days,
            Constants.CONTEST_MAX_ENTRIES_PER_PARTICIPANT,
            Constants.CONTEST_MAX_TOTAL_ENTRIES,
            Constants.CONTEST_NUMBER_OF_WINNERS
        );
        vm.startPrank(organizer);

        vm.stopPrank();
    }

    function testRevertIfVotingEndTimeBeforeVotingStartTime() public {
        // Attempt to create a contest where votingEndTime is before votingStartTime
        vm.expectRevert(ContestFactory.ContestFactory__VotingEndTimeMustBeAfterStartTime.selector);
        contest.createContest(
            Constants.CONTEST_TITLE,
            Constants.CONTEST_DESCRIPTION,
            block.timestamp,
            block.timestamp + 1 days,
            block.timestamp + 4 days,
            block.timestamp + 3 days,
            Constants.CONTEST_MAX_ENTRIES_PER_PARTICIPANT,
            Constants.CONTEST_MAX_TOTAL_ENTRIES,
            Constants.CONTEST_NUMBER_OF_WINNERS
        );
        vm.startPrank(organizer);

        vm.stopPrank();
    }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {Contest} from "../src/Contest.sol";
import {ContestFactory} from "../src/ContestFactory.sol";

contract DeployContest is Script {
    function run(
        string calldata title,
        string calldata description,
        uint256 entryStartTime,
        uint256 entryEndTime,
        uint256 votingStartTime,
        uint256 votingEndTime,
        uint256 numAllowedEntrySubmissions,
        uint256 maxTotalEntries
    ) external returns (Contest) {
        vm.startBroadcast();
        ContestFactory contest = new ContestFactory();
        address newContest = contest.createContest(
            title,
            description,
            entryStartTime,
            entryEndTime,
            votingStartTime,
            votingEndTime,
            numAllowedEntrySubmissions,
            maxTotalEntries
        );
        vm.stopBroadcast();

        return Contest(newContest);
    }
}

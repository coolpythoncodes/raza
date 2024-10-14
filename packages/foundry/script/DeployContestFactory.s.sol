// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {ContestFactory} from "../src/ContestFactory.sol";

contract DeployContestFactory is Script {
    function run() external returns (ContestFactory) {
        vm.startBroadcast();
        ContestFactory contest = new ContestFactory();
        vm.stopBroadcast();

        return contest;
    }
}

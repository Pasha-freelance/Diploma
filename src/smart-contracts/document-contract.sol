// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

struct InitDataStruct {
  string uuid;
  Metadata docMetadata;
  string originUser;
}

struct Metadata {
  string originalname;
  string mimetype;
}

contract DocumentContract {

  string public uuid;
  string public originUser;
  Metadata public docMetadata;

  mapping(string => bool) public allowedUsers;

  function init(InitDataStruct memory data) public {
    uuid = data.uuid;
    docMetadata = data.docMetadata;
    originUser = data.originUser;
  }

  function getData() public view returns (
    string memory,
    string memory,
    Metadata memory
  ) {
    return (uuid, originUser, docMetadata);
  }

  function attachAllowedUsers(string[] memory users) public {
    for(uint256 i; i < users.length; i++) {
      allowedUsers[users[i]] = true;
    }
  }

  function hasUserPermission(string memory userId) public view returns (bool) {
    return allowedUsers[userId];
  }
}

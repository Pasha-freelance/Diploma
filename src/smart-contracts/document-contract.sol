// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract DocumentContract {

  constructor(
    string memory uuid,
    Data memory info
  ) {
    data[uuid] = info;
  }

  struct Data {
    string originUser;
    string uuid;
    Metadata docMetadata;
  }

  struct Metadata {
    string originalname;
    string mimetype;
  }

  mapping(string => Data) public data;

  function setData(string memory uuid, Data memory info) public {
    data[uuid] = info;
  }

  function getData(string memory uuid) public view returns (Data memory) {
    return data[uuid];
  }
}

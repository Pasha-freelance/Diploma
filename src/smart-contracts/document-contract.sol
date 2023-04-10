// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract DocumentContract {

  struct Data {
    string hash;
    string prevHash;
    string originUser;
    string uuid;
    string timestamp;
    int nonce;
    Metadata docMetadata;
  }

  struct Metadata {
    string originalname;
    string mimetype;
  }

  mapping(string => Data) data;

  function getData(string memory uuid) public view returns (Data memory) {
    return data[uuid];
  }

  function setData(string memory uuid, Data memory info) public {
    data[uuid] = info;
  }
}

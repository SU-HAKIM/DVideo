// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;


contract DVideo{
    uint public videoCount=1;
    string public name="DVideo";

    struct Video{
        uint id;
        string _hash;
        string title;
        address author;
    }

    mapping(uint => Video) public videos;

    event VideoUploaded(
        uint id,
        string _hash,
        string title,
        address author
    );

    function uploadVideos(string memory _videosHash,string memory _title) public {
        //first validate
        require(bytes(_videosHash).length > 0);
        require(bytes(_title).length > 0);  
        require(msg.sender !=address(0));  
        //add video
        videos[videoCount]=Video(videoCount,_videosHash,_title,msg.sender);
        videoCount++;
        //emit an event
        emit VideoUploaded(videoCount, _videosHash, _title, msg.sender);
    }
} 
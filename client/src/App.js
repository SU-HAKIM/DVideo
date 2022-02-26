import React, { useEffect, useState } from "react";
import getContract from "./getWeb3";
import Web3 from 'web3';
import "./App.css";
import Navbar from "./components/Navbar";
import DVideo from "./contracts/DVideo.json";

import ipfs from "./ipfs";
const baseUrl = "https://ipfs.infura.io/ipfs/";

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [title, setTitle] = useState('');
  const [buffer, setBuffer] = useState(null);
  const [done, setDone] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState({});

  useEffect(() => {
    let connect = async () => {
      await connectToMetaMask()
    }
    connect()


  }, [done])

  const handleTitle = (e) => {
    setTitle(e.target.value);
  }

  const handleVideo = (e) => {
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
    }
  }

  const setVideo = (video) => {
    if (video._hash) {
      setSelectedVideo(video)
    }
    console.log("called")
  }

  const upload = async () => {
    try {
      ipfs.files.add(buffer, async (error, result) => {
        if (error) {
          console.log(error);
          return
        }
        await contract.methods.uploadVideos(result[0].hash, title).send({ from: accounts });
        setDone(true);
      })
    } catch (error) {
      console.log(error)
    }
  }


  const connectToMetaMask = async () => {
    if (typeof window !== undefined && typeof window.ethereum !== undefined) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let web3 = new Web3(window.ethereum);
        let accounts = await web3.eth.getAccounts();
        const contract = await getContract(web3, DVideo);
        const videoCount = await contract.contract.methods.videoCount().call();

        for (let i = 1; i < videoCount; i++) {
          let video = await contract.contract.methods.videos(i).call()
          setVideos(prev => ([...prev, video]));
        }
        //set info
        setWeb3(web3);
        setContract(contract.contract);
        setAccounts(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("Please install Meta Mask")
    }
  }
  return (
    <>
      {/* Navbar */}
      <Navbar address={accounts} />
      {/* Main Content */}
      <div className="container mt-2">
        <div className="row d-flex justify-content-between">
          {/* Videos */}
          <div className="col-md-8">
            {!selectedVideo._hash && videos.length ?
              <video key={videos[0].id} autoPlay controls style={{ height: 500, width: 700 }}>
                <source src={`${baseUrl}${videos[0]._hash}`} ></source>
              </video> :
              <video key={selectedVideo.id} autoPlay controls style={{ height: 500, width: 700 }}>
                <source src={`${baseUrl}${selectedVideo._hash}`} ></source>
              </video>
            }
          </div>
          {/* Form */}
          <div className="col-md-4 d-flex flex-column" style={{ borderLeft: "2px solid #999" }}>
            <div className="card card-body p-2 bg-light">
              <h4 className="mb-2">Upload Videos</h4>
              <input type='text' name="video" placeholder="video title.." className="form-control mb-1" value={title} onChange={handleTitle} />
              <input type='file' name='file' className="mb-2" onChange={handleVideo} />
              <button className="btn btn-primary btn-block" onClick={upload}>Upload!</button>
            </div>
            {/* Display */}
            <div className="card card-body mt-2" style={{ overflowY: "auto" }}>
              <h4 className="lead mb-2">Other Videos.</h4>
              <ul className="list-group">
                {
                  videos.map(video => <li
                    key={video.id}
                    className="d-flex list-group-item"
                    onClick={() => setVideo(video)}
                    style={{ cursor: "pointer" }}
                  >
                    <video style={{ width: 70, height: 50 }} muted>
                      <source src={`${baseUrl}${video._hash}`}></source>
                    </video>
                    <p className="lead">{video.title}</p>
                  </li>)
                }
              </ul>
            </div>
            {/* Display Ends */}
          </div>
          {/* Form Ends */}
        </div>
      </div>
    </>
  );
}


export default App;


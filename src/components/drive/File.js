import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { database, storage } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function File({ file }) {
  const [alert, setAlert] = useState(false);
  const { currentUser } = useAuth();
  var fileRef = database.files;
  var folderRef = database.folders;
  let query = fileRef
    .where("userID", "==", currentUser.uid)
    .where("url", "==", file.url);

  function getParentFolderID() {
    const result = query
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs[0].data().folderID;
      })
      .catch((error) => {
        console.log(error);
        return;
      });

    return result;
  }

  function getFileID() {
    const result = query
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs[0].id;
      })
      .catch((error) => {
        console.log(error);
        return;
      });

    return result;
  }

  async function getFilePath(parentID) {
    if (parentID === null) {
      return `/files/${currentUser.uid}/${file.name}`;
    }
    const folderPromise = folderRef
      .doc(parentID)
      .get()
      .then((docRef) => {
        return docRef.data();
      })
      .catch((error) => {
        console.log(error);
      });
    const folderInfo = await folderPromise;
    let filePath;
    const pathNames = [];
    for (let i = 0; i < folderInfo.path.length; i++) {
      pathNames.push(folderInfo.path[i].name);
    }
    filePath = [
      `/files/${currentUser.uid}`,
      pathNames,
      folderInfo.name,
      file.name,
    ].join("/");
    return filePath;
  }

  async function deleteFile() {
    const parentFolderID = await getParentFolderID();
    const storagePath = await getFilePath(parentFolderID);
    const deleteRef = storage.ref().child(storagePath);
    deleteRef
      .delete()
      .then(() => {
        console.log("Success in Storage");
      })
      .catch((error) => {
        console.log(`Error in Storage ${error}`);
      });

    const fileID = await getFileID();
    database.files
      .doc(fileID)
      .delete()
      .then(() => {
        console.log("Success in Firestore");
      })
      .catch((error) => {
        console.log(`Error in Firestore ${error}`);
      });
  }

  return (
    <>
      <a
        href={file.url}
        target="_blank"
        className="btn btn-outline-dark 
        text-truncate w-100"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faFile} className="mr-2" />
        {file.name}
      </a>
      {!alert && (
        <button
          className="w-100"
          onClick={() => setAlert((prevState) => !prevState)}
        >
          Delete
        </button>
      )}
      {alert && (
        <div>
          <p style={{ color: "red" }}>
            <b>ALERT! This action cannot be reversed.</b>
          </p>
          <button
            className="w-100"
            onClick={() => setAlert((prevState) => !prevState)}
          >
            Cancel
          </button>
          <button className="w-100" onClick={deleteFile}>
            Delete!
          </button>
        </div>
      )}
    </>
  );
}

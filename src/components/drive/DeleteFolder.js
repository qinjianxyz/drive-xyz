import { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive } from "@fortawesome/free-solid-svg-icons";
import { database } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { Redirect } from "react-router";

export default function DeleteFolder({ currentFolder }) {
  const { currentUser } = useAuth();
  var fileRef = database.files;
  var folderRef = database.folders;
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [redirect, setRedirect] = useState(false);

  function getChildren() {
    const result = fileRef
      .where("userID", "==", currentUser.uid)
      .where("folderID", "==", currentFolder.id)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.length;
      })
      .catch((error) => {
        console.log(error);
      });
    return result;
  }

  function getSubFolder() {
    const result = folderRef
      .where("userID", "==", currentUser.uid)
      .where("parentID", "==", currentFolder.id)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.length;
      })
      .catch((error) => {
        console.log(error);
      });
    return result;
  }

  async function deleteFolder() {
    if (currentFolder.id === null) {
      setMessage((prevState) => "Cannot delete Root Folder");
      setShow((prevState) => !prevState);
      return;
    }
    const childListLength = await getChildren();
    const subFolderList = await getSubFolder();
    if (childListLength > 0 || subFolderList > 0) {
      setMessage((prevState) => "Delete Subsidiaries First!");
      setShow((prevState) => !prevState);
      return;
    } else {
      database.folders
        .doc(currentFolder.id)
        .delete()
        .then(() => {
          console.log("Success in Firestore");
          setRedirect((prevState) => !prevState);
        })
        .catch((error) => {
          console.log(`Error in Firestore ${error}`);
        });
    }
  }

  function hideButton() {
    setMessage((prevState) => "");
    setShow((prevState) => !prevState);
  }

  return (
    <>
      <Button
        variant={"outline-danger"}
        onClick={deleteFolder}
        size="small"
        style={{ marginLeft: "7px" }}
      >
        <FontAwesomeIcon icon={faArchive} />
        <span>Delete Folder</span>
      </Button>
      {show && (
        <button style={{ color: "red" }} onClick={hideButton}>
          {message}
        </button>
      )}
      {redirect && <Redirect to={`/`} />}
    </>
  );
}

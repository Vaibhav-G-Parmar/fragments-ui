// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, getUserFragmentsWithId, getUserFragmentsMetadata, getUserFragmentMetadataWithId, postUserFragments, updateFragment, deleteFragment, convertFragment } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postBtn = document.querySelector('#post');
  const postInput = document.querySelector('#postInput');
  const getAllFragments = document.querySelector('#getAllFragments');
  const allFragments = document.querySelector('#allFragments');
  const getAllFragmentsIdWithMetadataBtn = document.querySelector('#getAllFragmentsIdWithMetadataBtn');
  const allFragmentsIdWithMetadata = document.querySelector('#allFragmentsIdWithMetadata');
  const idInput = document.querySelector('#idInput');
  const getFragment = document.querySelector('#getFragmentBtn');
  const getFragmentIDInfoBtn = document.querySelector('#getFragmentIDInfoBtn');
  const fragmentWithIdInfoDiv = document.querySelector('#fragmentWithIdInfoDiv');
  const fragmentWithId = document.querySelector('#fragmentWithId');
  const fragmentType = document.querySelector("#selectionType");
  const fileInput = document.querySelector("#file");
  const updateInputID = document.querySelector("#updateInputID");
  const updateInputData = document.querySelector("#updateInputData");
  const updateFragmentBtn = document.querySelector("#updateFragmentBtn");
  const deleteInputID = document.querySelector("#deleteInputID");
  const deleteFragmentBtn = document.querySelector("#deleteFragmentBtn");
  const getFragmentConvertedBtn = document.querySelector("#getFragmentConvertedBtn");
  const convertedFragmentDiv = document.querySelector("#convertedFragmentDiv");
 
 // Dynamically create and append the style element for table styling
 const styleElement = document.createElement('style');
 styleElement.innerHTML = `
   table {
     border-collapse: collapse;
     width: 100%; 
     margin-right: 20px; 
   }
   th, td {
     border: 1px solid #dddddd;
     text-align: center;
     padding: 8px;
   }`;

 document.head.appendChild(styleElement);


  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  postBtn.onclick = async () => {
    console.log(postInput.value)
    
    if(postInput.value === ""){
      const uploadedFile = fileInput.files[0]
      const reader = new FileReader()
      if(fragmentType.options[fragmentType.selectedIndex].value.startsWith("image")) {
        reader.onload = function (e) { 
          const imageContent = e.target.result   //storing the contents of the file into imageContent
        }
        await postUserFragments(user, fragmentType.options[fragmentType.selectedIndex].value, reader.readAsDataURL(uploadedFile))
      }
      else{
        //reading the file as text
        reader.readAsText(uploadedFile)
        reader.onload = async function () {
          const textContent = reader.result
          console.log("the uploaded file length is: ", content.length)
          await postUserFragments(user, fragmentType.options[fragmentType.selectedIndex].value, textContent)
        }
      }
    }
    else {
      //console.log(fragmentType.options[fragmentType.selectedIndex].value)
      if(fragmentType.options[fragmentType.selectedIndex].value == "text/plain" ||
      fragmentType.options[fragmentType.selectedIndex].value == "text/markdown" ||
      fragmentType.options[fragmentType.selectedIndex].value == "text/html" ||
      fragmentType.options[fragmentType.selectedIndex].value == "application/json") {
        postUserFragments(user, postInput.value, fragmentType.options[fragmentType.selectedIndex].value);
      }
    }
  }
  
  getAllFragments.onclick = async () => {
    console.log(postInput.value)
    var data = await getUserFragments(user)
    console.log('data: ' , data) 
    // Map each ID to include a number in front and add a newline in between
    const formattedIds = data.fragments.map((id, index) => `${index + 1}. ${id}`).join('<br>');
    allFragments.innerHTML = formattedIds 
    console.log('formatted ids:', formattedIds)
  }

  getAllFragmentsIdWithMetadataBtn.onclick = async () => {
    console.log(postInput.value)
    var data = await getUserFragmentsMetadata(user)
    console.log('data: ' , data) 

    var parsedData = JSON.parse(data).fragments;

    var tableHTML = '<table>';
    tableHTML += '<tr><th>id</th><th>ownerID</th><th>created</th><th>updated</th><th>type</th><th>size</th></tr>';

    parsedData.forEach(fragment => {
      tableHTML += `<tr><td>${fragment.id}</td><td>${fragment.ownerId}</td><td>${fragment.created}</td><td>${fragment.updated}</td><td>${fragment.type}</td><td>${fragment.size}</td></tr>`;
    });

    tableHTML += '</table>';
    document.getElementById('allFragmentsIdWithMetadata').innerHTML = tableHTML;
  }

  getFragment.onclick = async () => {
    console.log(idInput.value)
    var data = await getUserFragmentsWithId(idInput.value, user)
    if(data == undefined) {
      data = "<i><strong>Error! Fragment with the given ID does not exist!</strong></i>"
    } else {
      console.log('data with Id: ' , data) 
    }
    fragmentWithId.innerHTML = "<b>Content:</b> " + data + "<br><b>Length:</b> " + data.length + "<br><b>Type:</b> "; 
  }

  //get id with info API
  getFragmentIDInfoBtn.onclick = async () => {
    console.log(idInput.value)
    var data = await getUserFragmentMetadataWithId(idInput.value, user)
    if(data == undefined) {
      data = "<i><strong>Error! Fragment with the given ID does not exist!</strong></i>"
    } else {
      console.log('data with Id info: ' , data) 
      var fragment = JSON.parse(data).fragment;
  
      var infoString = `<b><i>ID:</i></b> ${fragment.id}<br>`;
      infoString += `<b><i>OwnerId:</i></b> ${fragment.ownerId}<br>`;
      infoString += `<b><i>Created:</i></b> ${fragment.created}<br>`;
      infoString += `<b><i>Updated:</i></b> ${fragment.updated}<br>`;
      infoString += `<b><i>Type:</i></b> ${fragment.type}<br>`;
      infoString += `<b><i>Size:</i></b> ${fragment.size}<br>`;
    
      document.getElementById('fragmentWithIdInfoDiv').innerHTML = infoString;
    }
  }


  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();

    // Do an authenticated request to the fragments API server and log the result
    getUserFragments(user);

  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  //update the fragment 
  updateFragmentBtn.onclick = async () => {
    updateFragment(user, updateInputID.value, fragmentType.options[fragmentType.selectedIndex].value, updateInputData.value)
  }
  
  //delete the fragment 
  deleteFragmentBtn.onclick = () => {
    deleteFragment(user, deleteInputID.value)
  }
  
  getFragmentConvertedBtn.onclick = () => {
    convertFragment(user, convertIdInput.value)
  }

}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
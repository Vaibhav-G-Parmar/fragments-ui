// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, getUserFragmentsWithId, postUserFragments } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const postBtn = document.querySelector('#post');
  const postInput = document.querySelector('#postInput');
  const getAllFragments = document.querySelector('#getAllFragments');
  const allFragments = document.querySelector('#allFragments');
  const idInput = document.querySelector('#idInput');
  const getFragment = document.querySelector('#getFragment');
  const fragmentWithId = document.querySelector('#fragmentWithId');
  const inputIdToShow = document.querySelector('#inputIdToShow');
 
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
  postBtn.onclick = () => {
    console.log(postInput.value)
    postUserFragments(postInput.value, user);
  }
  getAllFragments.onclick = async () => {
    console.log(postInput.value)
    var data = await getUserFragments(user)
    console.log('data: ' , data) 
    allFragments.innerHTML = data.fragments
  }
  getFragment.onclick = async () => {
    console.log(idInput.value)
    var data = await getUserFragmentsWithId(idInput.value, user)
    console.log('data with Id: ' , data) 
    fragmentWithId.innerHTML = data 
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
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
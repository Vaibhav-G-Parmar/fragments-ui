// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders('text/plain'),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    //console.log('Got user fragments data', data );
    return data
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function getUserFragmentsWithId(id, user) {
  console.log('Requesting user fragments data with id...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      // Generate headers with the proper Authorization bearer token to pass
      //headers: user.authorizationHeaders('text/plain'),
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    //const data = await res.json();
    const data = await res.text();
    const type = await res.getUserFragmentMetadataWithId
    console.log('Got user fragment with Id', { data }, 'and Content-Type', {type});
    console.log("Got user fragment and it's type with Id data.");
    return data
  } catch (err) {
    console.error(`Unable to call GET /v1/fragment/${id}`, err);
  }
}

export async function postUserFragments(user, postInput, fType) {
  console.log('Posting user fragments data...', postInput, 'with type', fType)
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      // Generate headers with the proper Authorization bearer token to pass
      headers: {
        //user.authorizationHeaders('text/plain')
        'Authorization': `Bearer ${user.idToken}`,
        'Content-Type': fType
      },
      body: postInput
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res}`)
    }
    const data = await res.json();
    console.log('Got user fragments data', data )
    //console.log('Got authorization header', authorizationHeaders.Authorization )
    //await getUserFragmentsWithId(data.fragment.id, user)
  } catch (err) {
    console.error('Unable to POST /v1/fragment', { err })
  }
}

export async function getUserFragmentsMetadata(user) {
  console.log('Requesting ALL user fragments metadata...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      //headers: user.authorizationHeaders('text/plain'),
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    //const data = await res.json();
    const data = await res.text();
    console.log('Got all user fragment metadata:', { data });
    console.log('Got all user fragment metadata with.');
    return data
  } catch (err) {
    console.error(`Unable to call GET /v1/fragment/?expand=1`, err);
  }
}

export async function getUserFragmentMetadataWithId(id, user) {
  console.log('Requesting user fragments metadata...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      // Generate headers with the proper Authorization bearer token to pass
      //headers: user.authorizationHeaders('text/plain'),
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    //const data = await res.json();
    const data = await res.text();
    console.log('Got user fragment metadata:', { data });
    console.log('Got user fragment metadata with Id data.');
    return data
  } catch (err) {
    console.error(`Unable to call GET /v1/fragment/${id}/info`, err);
  }
}

/** Update fragment function **/
export async function updateFragment(user, id, type, content) {
  console.log("Updating user fragments data...");
  try {
    console.log(type);
    console.log(content);
    console.log(id);
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        //"Content-Type": `${type}`,
      },
      body: `${content}`,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Put user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call PUT /v1/fragment", { err });
  }
}

/** Delete fragment function **/
export async function deleteFragment(user, id) {
  console.log('Deleting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "DELETE",
      // Generate headers with the proper Authorization bearer token to pass
      headers: {
        'Authorization': `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data
  } catch (err) {
    console.error('Unable to call DELETE /v1/fragment', { err });
  }
}

/** Convert fragment function **/
export async function convertFragment(user, id) {
  console.log('Converting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}.html`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: {
        'Authorization': `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data
  } catch (err) {
    console.error('Unable to call Convert /v1/fragment', { err });
  }
}
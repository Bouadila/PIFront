const LOCAL_SERVER_URL = 'https://lernigoback.herokuapp.com/';
export const getToken = async () => {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/get-token`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const { token } = await response.json();
    return token;
  } catch (e) {
    console.log(e);
  }
};
export const getMeetingId = async (token) => {
  try {
    const VIDEOSDK_API_ENDPOINT = `${LOCAL_SERVER_URL}/create-meeting`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, region: 'sg001' })
    };
    const response = await fetch(VIDEOSDK_API_ENDPOINT, options)
      .then(async (result) => {
        const { meetingId } = await result.json();
        return meetingId;
      })
      .catch((error) => console.log('error', error));
    return response;
  } catch (e) {
    console.log(e);
  }
};

import {Soundcloud} from './services'

// Auth
export const REQUEST_ACCESS_TOKEN = 'REQUEST_ACCESS_TOKEN'
export const requestAccessToken = () => ({
  type: REQUEST_ACCESS_TOKEN
})

export const RECEIVE_ACCESS_TOKEN = 'RECEIVE_ACCESS_TOKEN'
export const receiveAccessToken = token => ({
  type: RECEIVE_ACCESS_TOKEN,
  token
})

export const fetchAccessToken = () => async dispatch => {
  dispatch(requestAccessToken())
  const token = await Soundcloud.authenticate()
  return dispatch(receiveAccessToken(token))
}

// Tracks
export const REQUEST_TRACKS = 'REQUEST_TRACKS'
export const requestTracks = () => ({
  type: REQUEST_TRACKS
})

export const RECEIVE_TRACKS = 'RECEIVE_TRACKS'
export const receiveTracks = tracks => ({
  type: RECEIVE_TRACKS,
  collection: tracks
})

export const fetchTracks = () => async (dispatch, getState) => {
  dispatch(requestTracks())
  const token = getState().accessToken.token
  const tracks = await Soundcloud.getTracks()

  const modified = tracks.map(track => ({
    ...track,
    download: Soundcloud.makeDownloadable(track.download_url, token)
  }))

  return dispatch(receiveTracks(modified))
}
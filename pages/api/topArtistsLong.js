import {getTopArtistsLong} from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
  try {
    const {token: {accessToken}} = await getSession({req});
    const response = await getTopArtistsLong(accessToken);
    const {items} = await response.json();
    return res.status(200).json({items});
  } catch (error) {
    return res.redirect('/signin')
  }
};
export default handler;
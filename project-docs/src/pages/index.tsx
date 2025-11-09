import { useHistory } from '@docusaurus/router';
import { useEffect } from 'react';

export default function Home(): null {
  const history = useHistory();
  
  useEffect(() => {
    history.replace('/planning/vision');
  }, [history]);
  
  return null;
}

import { useParams } from 'react-router-dom';
function Post(){
    const {postId} = useParams(); 
    return <>
    This is an individual post with id as {postId}
    </>
}
export default Post;
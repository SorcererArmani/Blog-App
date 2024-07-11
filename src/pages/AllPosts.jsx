import React ,{useState , useEffect} from 'react'
import service from '../appwrite/config'
import { Container, PostCard } from '../components'

function AllPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => {

    }, [])

    service.listPost([]).then((posts) => {
        if (posts) {
            setPosts(posts.documents)
        }
    })
    .catch()
    
  return (
    <div className='py-8'>
        <Container>
            <div className='flex flex-wrap'>
            {posts.map((post) => {
                <div key={post.$id} className='p-2 w-1/2'>
                    <PostCard post={post} />
                </div>
            })}
            </div>
        </Container>
    </div>
  )
}

export default AllPosts
import {useState} from 'react'
import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import {Box, FormControl, FormLabel, Input, Button} from '@chakra-ui/react'

import {useAuth} from '@/lib/auth'
import {createFeedback} from '@/lib/db'
import {getAllFeedback, getAllSites} from '@/lib/db-admin'

import {Feedback} from '@/components/feedback'

export async function getStaticProps({params}) {
  const {siteId} = params
  const {feedback} = await getAllFeedback(siteId)

  return {
    props: {
      initialFeedback: feedback,
    },
    revalidate: 1,
  }
}

// generate static page for all sites
export async function getStaticPaths() {
  const {sites} = await getAllSites()

  const paths = sites.map(site => ({
    params: {
      siteId: site.id.toString(),
    },
  }))

  return {
    paths,
    fallback: true,
  }
}

function FeedbackPage({initialFeedback}) {
  const {query, isFallback} = useRouter()
  const auth = useAuth()

  const {handleSubmit, register, reset} = useForm({
    defaultValues: {text: ''},
  })

  const [allFeedback, setAllFeedback] = useState(initialFeedback)

  const onSubmit = ({text}) => {
    const newFeedback = {
      author: auth.user.name,
      authorId: auth.user.uid,
      siteId: query.siteId,
      createdAt: new Date().toISOString(),
      provider: auth.user.provider,
      status: 'pending',
      text,
    }
    setAllFeedback([newFeedback, ...allFeedback])

    createFeedback(newFeedback)
    reset()
  }

  return (
    <Box display="flex" flexDirection="column" width="full" maxWidth="700px" margin="0 auto">
      {auth.user && (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl my={8}>
            <FormLabel htmlFor="comment">Comment</FormLabel>
            <Input id="comment" placeholder="Leave a comment" {...register('text', {required: true})} />

            <Button mt={4} type="submit" fontWeight="medium" isDisabled={isFallback}>
              Add Comment
            </Button>
          </FormControl>
        </Box>
      )}

      {allFeedback && allFeedback.map(feedback => <Feedback key={feedback.id} {...feedback} />)}
    </Box>
  )
}

export default FeedbackPage

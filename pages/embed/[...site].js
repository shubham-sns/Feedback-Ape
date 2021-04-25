import {useRouter} from 'next/router'
import {Box} from '@chakra-ui/react'
import 'iframe-resizer/js/iframeResizer.contentWindow'

import {getAllFeedback, getAllSites, getSite} from '@/lib/db-admin'

import {FeedbackLink} from '@/components/feedback-link'
import {Feedback} from '@/components/feedback'

export async function getStaticProps(context) {
  const [siteId, route] = context.params.site
  const {feedback} = await getAllFeedback(siteId, route)
  const {site} = await getSite(siteId)

  return {
    props: {
      initialFeedback: feedback,
      site,
    },
    revalidate: 1,
  }
}

export async function getStaticPaths() {
  const {sites} = await getAllSites()
  const paths = sites.map(site => ({
    params: {
      site: [site.id.toString()],
    },
  }))

  return {
    paths,
    fallback: true,
  }
}

function EmbeddedFeedbackPage({initialFeedback, site}) {
  const router = useRouter()

  console.log(router.query.site)

  return (
    <Box display="flex" flexDirection="column" width="full">
      <FeedbackLink paths={router.query.site} />

      {initialFeedback?.length ? (
        initialFeedback.map((feedback, index) => (
          <Feedback
            key={feedback.id}
            settings={site?.settings}
            isLast={index === initialFeedback.length - 1}
            {...feedback}
          />
        ))
      ) : (
        <Box>There are no comments for this site.</Box>
      )}
    </Box>
  )
}

export default EmbeddedFeedbackPage
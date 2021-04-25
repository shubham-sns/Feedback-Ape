import NextLink from 'next/link'
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading, Flex, Box} from '@chakra-ui/react'

function SiteHeader({siteName}) {
  return (
    <Box mx={4}>
      <Breadcrumb>
        <BreadcrumbItem>
          <NextLink href="/sites" passHref>
            <BreadcrumbLink>Sites</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{siteName || '-'}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex justifyContent="space-between">
        <Heading mb={8}>{siteName || '-'}</Heading>
      </Flex>
    </Box>
  )
}

export {SiteHeader}
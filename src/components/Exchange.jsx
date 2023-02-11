import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';
import { server } from '../index';
import { Container, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
const Exchange = () => {
    const [exchanges, setExchanges] = useState([])
    const [Loading, setLoading] = useState(true)
    const [Error, setError] = useState(false)
    useEffect(() => {
        const fetchExchanges = async () => {
            try {
                const { data } = await axios.get(`${server}/exchanges`)
                // console.log(data);
                setExchanges(data);
                setLoading(false)
            } catch (err) {
                setError(true)
                setLoading(false)
            }
        }
        fetchExchanges();
    }, []);

    if(Error) {
        return <ErrorComponent message={"Error while fetching exchanges"}/>
    }
    return (
        <Container maxW={'container.xl'}>
            {
                Loading ? <Loader /> : <>

                    <HStack wrap={'wrap'} justifyContent='space-evenly'>
                        {
                            exchanges.map((i) => (
                                <>
                                    {/* <div>{i.name}</div> */}
                                    <ExchangeCard
                                        name={i.name}
                                        image={i.image}
                                        rank={i.trust_score_rank}
                                        url={i.url}
                                        key={i.id}
                                    />
                                </>
                            ))
                        }
                    </HStack>
                </>
            }
        </Container>
    )
}

const ExchangeCard = ({ name, image, rank, url }) => (
    <a href={url} target="_blank">
        <VStack w='52' shadow={'lg'} p='8' borderRadius={'lg'} transition='all 0.5s' m='4'
            css={{
                '&:hover': {
                    transform: "scale(1.1)"
                }
            }}
        >
            <Image src={image} w='10' h='10' objectFit={'contain'} alt='Exchange Card' />
            <Heading size={'md'} noOfLines={1}>
                {rank}
            </Heading>
            <Text noOfLines={1}>{name}</Text>
        </VStack>
    </a>
)
export default Exchange
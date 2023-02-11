import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from './Loader';
import CoinCard from './CoinCard';
import ErrorComponent from './ErrorComponent';
import { server } from '../index';
import { Button, Container, HStack, Radio, RadioGroup} from '@chakra-ui/react';
const Coin = () => {
  const [coin, setCoin] = useState([])
  const [Loading, setLoading] = useState(true)
  const [Error, setError] = useState(false)
  const [Page, setPage] = useState(1)
  const [currency, setcurrency] = useState('inr')

  const currencySymbol = currency === 'inr' ? "₹" : currency === 'eur' ? '€' : '$';
  
  const changePage = (page) => {
    setPage(page);
    setLoading(true);
  }
  
  const btn = new Array(132).fill(1)


  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${Page}`)
        setCoin(data);
        // console.log(data);
        setLoading(false)
      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }
    fetchCoin();
  }, [currency, Page]);

  if (Error) {
    return <ErrorComponent message={"Error while fetching Coins"} />
  }
  return (
    <Container maxW={'container.xl'}>
      {
        Loading ? <Loader /> : <>
    {/* const currencySymbol = currency === 'inr' ? "₹" : currency === 'eur' ? '€' : '$'; */}
          <RadioGroup value={currency} onChange={setcurrency} p='8'>
            <HStack spacing={'4'}>
              <Radio value={'inr'}>₹ INR</Radio>
              <Radio value={'eur'}>€ EURO</Radio>
              <Radio value={'usd'}>$ DOLLER</Radio>
            </HStack>
          </RadioGroup>
          <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
            {
              coin.map((i) => (
                <>
                  {/* <div>{i.name}</div> */}
                  <CoinCard
                    id={i.id}
                    key={i.id}
                    name={i.name}
                    image={i.image}
                    price={i.current_price}
                    symbol={i.symbol}
                    currencySymbol={currencySymbol}
                  />
                </>
              ))
            }
          </HStack>
          <HStack w='full' overflow={'auto'} p='8'>
            {
              btn.map((item, index) => (
              <Button
                key={index}
                bgColor={'blackAlpha.900'}
                color='white'
                onClick={() => changePage(index+1)}>{index+1}</Button>
              ))
            }
          </HStack>
        </>
      }
    </Container>
  )
}


export default Coin
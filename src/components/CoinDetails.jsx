import { Badge, Box, Button, Container, HStack, Image, Progress, Radio, RadioGroup, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import { server } from '../index';
import { useParams } from 'react-router-dom'
import ErrorComponent from './ErrorComponent';
import Chart from './Chart';


const CoinDetails = () => {
  const params = useParams()
  const [coin, setCoin] = useState({})
  const [Loading, setLoading] = useState(true)
  const [Error, setError] = useState(false)
  const [currency, setcurrency] = useState('inr')
  const [days, setdays] = useState('24h')
  const [chartarray, setchartarray] = useState([])

  const currencySymbol = currency === 'inr' ? "₹" : currency === 'eur' ? '€' : '$';

  const btns = ['24h', '7d', '14d', '30d', '60d', '200d', '365d', 'max'];

  const switchChartStats = (key) => {
    switch (key) {
      case "24h":
        setdays("24h");
        setLoading(true);
        break;
      case "7d":
        setdays("7d");
        setLoading(true);
        break;
      case "14d":
        setdays("14d");
        setLoading(true);
        break;
      case "30":
        setdays("30");
        setLoading(true);
        break;
      case "60d":
        setdays("60d");
        setLoading(true);
        break;
      case "200d":
        setdays("200d");
        setLoading(true);
        break;
      case "365d":
        setdays("365d");
        setLoading(true);
        break;
      case "max":
        setdays("max");
        setLoading(true);
        break;
      default:
        setdays("24h");
        setLoading(true);
        break;
    }
  }

  useEffect(() => {
    const fetchC = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`)
        const { data: chartData } = await axios.get(`${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`)
        // console.log(data);

        setCoin(data);
        setchartarray(chartData.prices);

        setLoading(false)
      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }
    fetchC();
  }, [params.id, currency, days]);

  if (Error) {
    return <ErrorComponent message={"Error while fetching Coin"} />
  }
  return (
    <Container maxW={'container.xl'}  >
      {
        Loading ? <Loader /> : (<>


          <Box w={'full'} borderWidth={1}>
            <Chart arr={chartarray} currency={currencySymbol} days={days} />
          </Box>

          <HStack p='4' overflowX={'auto'}>
            {
              btns.map((i) => (
                <Button key={i} onClick={() => switchChartStats(i)}>{i}</Button>
              ))
            }

          </HStack>

          <RadioGroup value={currency} onChange={setcurrency} p='8'>
            <HStack spacing={'4'}>
              <Radio value={'inr'}>₹ INR</Radio>
              <Radio value={'eur'}>€ EURO</Radio>
              <Radio value={'usd'}>$ DOLLER</Radio>
            </HStack>
          </RadioGroup>


          <VStack p={'16'} spacing='4' alignItems={'flex-start'} >
            <Text fontSize={'small'} alignSelf='center' opacity='0.7'>
              Last Upadted On {Date(coin.market_data.last_updated).split('G')[0]}
            </Text>

            <Image src={coin.image.large} w='16' h='16' objectFit={'contain'} />

            <Stat>


              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>{currencySymbol}{coin.market_data.current_price[currency]}</StatNumber>
              <StatHelpText>

                <StatArrow type={coin.market_data.price_change_percentage_24h > 0 ? 'increase' : 'decrease'} />
                {coin.market_data.price_change_percentage_24h}%
              </StatHelpText>

            </Stat>

            <Badge fontSize={'2xl'} bgColor={'blackAlpha.900'} color='white' >
              {`#${coin.market_cap_rank}`}
            </Badge>

            <CustomBar high={`${currencySymbol}${coin.market_data.high_24h[currency]}`}
              low={`${currencySymbol}${coin.market_data.low_24h[currency]}`} />

            <Box w={'full'} p={'4'} >
              <Item title={' Max Supply'} value={coin.market_data.max_supply} />
              <Item title={' Circulating Supply'} value={coin.market_data.circulating_supply} />
              <Item title={' Market Capital'} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`} />
              <Item title={' All time low'} value={`${currencySymbol}${coin.market_data.atl[currency]}`} />
              <Item title={' All time high'} value={`${currencySymbol}${coin.market_data.ath[currency]}`} />
            </Box>
          </VStack>
        </>)
      }
    </Container>
  )
}


const Item = ({ title, value }) => (
  <HStack justifyContent={'space-between'} w='full' my='4'>
    <Text fontFamily={'Bebas Neue'} letterSpacing={'widest'}>
      {title}
    </Text>
    <Text>{value}</Text>
  </HStack>
)


const CustomBar = ({ high, low }) => (
  <VStack w='full'>
    <Progress value={50} colorScheme='teal' w='full' />
    <HStack justifyContent={'space-between'} w='full' >
      <Badge children={low} colorScheme='red' />
      <Text fontSize={'sm'}>24 hrs range</Text>
      <Badge children={high} colorScheme='green' />
    </HStack>
  </VStack>
)

export default CoinDetails

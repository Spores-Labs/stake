import './LeaderBoard.css';
import { Container, styled, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useQuery } from 'react-query';

const StyledTableCell = styled(TableCell)`
  background-color: inherit;
  color: #ccc3b5;
  font-size: 20px;
  text-align: center;
  border: 1px solid #503f35;
  @media (max-width: 1024px) {
    font-size: 10px;
  }
`;

const StyledHeaderCell = styled(TableCell)`
  border: 1px solid #503f35;
  background-color: inherit;
  font-size: 20px;
  text-align: center;
  color: #968469;
  @media (max-width: 1024px) {
    font-size: 10px;
  }
`;

const TopStakerInfo = ({ address, amount, bottom }) => (
  <div
    style={{
      background: '#FFFFFF1A',
      borderRadius: 16,
      transform: 'translateX(-50%)',
      width: '75%',
      bottom,
    }}
    className='flex flex-col items-center gap-1 md:gap-3 text-smallest md:text-xl absolute left-1/2 py-2 md:py-3'
  >
    <div style={{ color: '#FDE4BF' }}>{address}</div>
    <div style={{ color: '#E8CB9F' }} className='flex gap-1'>
      <img src='/assets/icons/OKG-token.png' alt='OKG' className='h-2.5 md:h-6' />
      {Number(amount).toLocaleString()}
    </div>
  </div>
);

const LeaderBoard = () => {
  const { isMobile } = useWindowDimensions();

  const { data: list = [] } = useQuery(
    ['fetchTokenBalance', process.env.REACT_APP_LEADERBOARD_API],
    async ({ queryKey }) => {
      const dataResponse = await fetch(queryKey[1]).then((res) => res.json());
      return dataResponse.data;
    },
  );

  return list.length > 3 ? (
    <div
      style={{
        background: `url('/assets/images/background-leaderBoard.png') no-repeat center top / 100%`,
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Container className='flex flex-col items-center py-20 md:py-28 text-color-secondary' style={{ maxWidth: 1084 }}>
        <div className='font-skadi text-xl md:text-5xl mb-9'>LEADERBOARD OF STAKERS</div>
        <div className='grid grid-cols-3 md:gap-5 w-full mb-8 md:mb-32'>
          <div className='col-span-1 relative flex items-end justify-end'>
            <img
              src='/assets/images/leaderBoard-hero-1.png'
              alt='hero-1'
              className='hidden md:block absolute'
              style={{ top: '20%', left: '-75%' }}
            />
            <div className='relative'>
              <img src='/assets/images/leaderBoard-top-2.png' alt='top-2' />
              <TopStakerInfo address={list[1].wallet_address} amount={list[1].total} bottom={isMobile ? 30 : 110} />
            </div>
            <img
              src='/assets/images/leaderBoard-gold-1.png'
              alt='gold-1'
              className='hidden md:block absolute'
              style={{ bottom: '-15%', left: '-60%' }}
            />
          </div>
          <div className='col-span-1 relative flex items-end'>
            <img src='/assets/images/leaderBoard-top-1.png' alt='top-1' />
            <TopStakerInfo address={list[0].wallet_address} amount={list[0].total} bottom={isMobile ? 60 : 190} />
          </div>
          <div className='col-span-1 relative flex items-end justify-start'>
            <img
              src='/assets/images/leaderBoard-hero-2.png'
              alt='hero-2'
              className='hidden md:block absolute'
              style={{ top: '25%', right: '-65%' }}
            />
            <div className='relative'>
              <img src='/assets/images/leaderBoard-top-3.png' alt='top-3' />
              <TopStakerInfo address={list[2].wallet_address} amount={list[2].total} bottom={isMobile ? 10 : 60} />
            </div>
            <img
              src='/assets/images/leaderBoard-gold-2.png'
              alt='gold-2'
              className='hidden md:block absolute'
              style={{ bottom: '-20%', right: '-60%' }}
            />
          </div>
        </div>
        <div
          className='bg-color-dark w-full flex flex-col items-center px-8 md:px-24'
          style={{
            background: `url('/assets/images/frame-leaderBoard.png') no-repeat center top`,
            backgroundSize: '100% 100%',
            height: isMobile ? 700 : 860,
            maxWidth: 1240,
          }}
        >
          <div
            style={{
              background: `url('/assets/components/yellow_trapezium.png') no-repeat center top`,
              backgroundSize: '100% 100%',
              fontSize: isMobile ? 14 : 35,
            }}
            className='text-center text-color-secondary font-skadi w-fit py-3 md:py-5 px-16 md:px-32 mb-4 md:mb-8 whitespace-nowrap'
          >
            TOP STAKERS
          </div>
          <div className='w-full flex justify-center overflow-auto' style={{ maxHeight: isMobile ? 579 : 674 }}>
            <Table className='mb-1'>
              <TableHead>
                <TableRow>
                  <StyledHeaderCell>Ranking</StyledHeaderCell>
                  <StyledHeaderCell>Wallet Owner</StyledHeaderCell>
                  <StyledHeaderCell>Staked Amount (OKG)</StyledHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((data, index) => (
                  <TableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{data.wallet_address}</StyledTableCell>
                    <StyledTableCell>{Number(data.total).toLocaleString()}</StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  ) : null;
};

export default LeaderBoard;

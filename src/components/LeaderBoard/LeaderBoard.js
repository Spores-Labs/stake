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
      padding: '12px 24px',
      bottom,
    }}
    className='flex flex-col items-center gap-3 text-xl absolute left-1/2'
  >
    <div style={{ color: '#FDE4BF' }}>{address}</div>
    <div style={{ color: '#E8CB9F' }} className='flex gap-1'>
      <img src='/assets/icons/OKG-token.png' alt='OKG' className='h-6' />
      {amount}
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
      <Container className='flex flex-col items-center py-20 md:py-28 text-color-secondary custom-container'>
        <div className='font-skadi text-xl md:text-5xl mb-9'>LEADERBOARD OF STAKERS</div>
        <div className='flex flex-col md:flex-row md:gap-5 w-full mb-8 md:mb-32'>
          <div className='relative flex-1'>
            <img src='/assets/images/leaderBoard-hero-1.png' alt='hero-1' className='mt-28' />
            <div className='absolute bottom-0 right-0'>
              <div className='relative'>
                <img src='/assets/images/leaderBoard-top-2.png' alt='top-2' />
                <TopStakerInfo address={list[1].wallet_address} amount={list[1].total} bottom={128} />
              </div>
            </div>
            <img
              src='/assets/images/leaderBoard-gold-1.png'
              alt='gold-1'
              className='hidden md:block absolute -bottom-20'
            />
          </div>
          <div className='relative'>
            <img src='/assets/images/leaderBoard-top-1.png' alt='top-1' />
            <TopStakerInfo address={list[0].wallet_address} amount={list[0].total} bottom={208} />
          </div>
          <div className='relative flex-1 flex justify-end'>
            <img src='/assets/images/leaderBoard-hero-2.png' alt='hero-2' className='mt-28' />
            <div className='absolute bottom-0 left-0'>
              <div className='relative'>
                <img src='/assets/images/leaderBoard-top-3.png' alt='top-3' />
                <TopStakerInfo address={list[2].wallet_address} amount={list[2].total} bottom={72} />
              </div>
            </div>
            <img
              src='/assets/images/leaderBoard-gold-2.png'
              alt='gold-2'
              className='hidden md:block absolute -bottom-28 right-10'
            />
          </div>
        </div>
        <div
          className='bg-color-dark w-full flex flex-col items-center px-8 md:px-24'
          style={{
            background: `url('/assets/images/frame-leaderBoard.png') no-repeat center top`,
            backgroundSize: '100% 100%',
            height: isMobile ? 700 : 900,
            maxWidth: 1240,
          }}
        >
          <div
            style={{
              background: `url('/assets/components/yellow_trapezium.png') no-repeat center top`,
              backgroundSize: '100% 100%',
              fontSize: isMobile ? 20 : 35,
            }}
            className='text-center text-color-secondary font-skadi w-fit py-3 md:py-5 px-16 md:px-32 mb-4 md:mb-8 whitespace-nowrap'
          >
            TOP STAKERS
          </div>
          <Table>
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
                  <StyledTableCell>{data.total}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Container>
    </div>
  ) : null;
};

export default LeaderBoard;

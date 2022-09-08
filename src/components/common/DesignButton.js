import { LoadingButton } from '@mui/lab';
import { CircularProgress } from '@mui/material';

const DesignButton = (props) => {
  const { design = 'orange', imageSize = 'medium' } = props;
  return (
    <LoadingButton
      sx={{
        background: `url('assets/components/${design}_${imageSize}.png')`,
        backgroundSize: '100% 100%',
        fontFamily: 'Skranji',
        color: design === 'gray' ? '#B7A284' : '#F1E9DC',
        paddingLeft: 2,
        paddingRight: 2,
        minWidth: 0,
        textShadow: '0 4px 2px #0004',
      }}
      classes={{
        sizeLarge: 'h-15 text-xl',
        sizeMedium: 'h-11',
      }}
      loadingIndicator={
        <div
          className='flex gap-1 items-center'
          style={{
            fontFamily: 'Skranji',
            color: design === 'gray' ? '#B7A284' : '#F1E9DC',
            textShadow: '0 4px 2px #0004',
          }}
        >
          <CircularProgress size={20} color='inherit' />
          LOADING
        </div>
      }
      {...props}
    />
  );
};

export default DesignButton;

import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const CloseButton = (props) => {
  return (
    <IconButton
      sx={{
        background: `url('assets/components/gray_square.png') no-repeat center/contain`,
        borderRadius: 0,
        position: 'absolute',
        top: 0,
        right: 0,
      }}
      {...props}
    >
      <Close className='text-color-primary' />
    </IconButton>
  );
};

export default CloseButton;

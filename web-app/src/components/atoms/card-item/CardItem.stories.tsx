import { Stack, Typography } from '@mui/material';
import GiggerCardItem from './CardItem';


export const CardItem = () => {
  return (
    <Stack 
        direction={'row'} 
        justifyContent={'space-between'}
        
        >
      <Stack>
        <GiggerCardItem 
            cardItemLabel={<Typography variant='h3'>Hola</Typography>}
            cardItemContent={<Typography variant='body1'>Test</Typography>}
            />

      </Stack>
    </Stack>
  );
};

export default {
  title: 'Atoms / CardItem',
  component: GiggerCardItem,
};

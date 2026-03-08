import { CardActionArea, CardActions, CardContent, CardHeader, Card as MUICard } from "@mui/material";
import type React from "react";

type ICardProps = {
  headerContent: React.ReactNode;
  cardContent: React.ReactNode;
  cardMainAction: ()=>void;
  cardActions: React.ReactNode;

}

const Card = ({
  headerContent,
  cardContent,
  cardMainAction,
  cardActions
}: ICardProps) => {
  return (
    <MUICard elevation={4} >
      <CardActionArea onClick={cardMainAction}>
        {headerContent && <CardHeader title={headerContent} />}
        {cardContent && <CardContent>{cardContent}</CardContent>}
      </CardActionArea>
      {cardActions && <CardActions>
        {cardActions}
      </CardActions>}


    </MUICard>
  )
}

export default Card
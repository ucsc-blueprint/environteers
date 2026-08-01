import type { CardProps } from '@/context/InteractionsContext';

export function getCardDate(card: CardProps): Date | null {
  if (!card?.cardInfo) return null;

  if (
    (card.cardType === 'event' || card.cardType === 'in_person' || card.cardType === 'online') &&
    card.cardInfo.end_date
  ) {
    return new Date(card.cardInfo.end_date);
  }

  return null;
}

export function cardRequiresAction(card: CardProps, now = new Date()): boolean {
  const date = getCardDate(card);
  const isPast = date ? date < now : false;

  if (card.cardType === 'online') {
    return card.clicked === true && card.completed === null;
  }

  if (card.cardType === 'event' || card.cardType === 'in_person') {
    const notSignedUpYet = card.clicked === true && card.signed_up === null;
    const needsCompletion =
      card.clicked === true && card.signed_up === true && isPast && card.completed === null;

    return notSignedUpYet || needsCompletion;
  }

  return false;
}

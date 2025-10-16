
import './card.scss';
import { CtaLink } from '../CtaLink/CtaLink';
import { ImageBanner } from '../ImageBanner/ImageBanner';

export function Card({
  event,
  index,
  isPlaying,
  openEventIds,
  handlePlayPreview,
  toggleMoreInfo,
  formatDate,
  formatSaleDate,
}) {
  return (
    <div className={`card-item ${index === 0 ? "featured" : ""}`}>

      <ImageBanner
        event={event}
        isPlaying={isPlaying}
        handlePlayPreview={handlePlayPreview}
        formatSaleDate={formatSaleDate}
      />

      <div className='card-summary'>
        <p className='card-summary__date'>{formatDate(event.date)}</p>
        <h2 className='card-summary__name'>{event.name.length > 60 ? event.name.slice(0, 60) + '...' : event.name}</h2>
        <p className='card-summary__venue'>
          <strong>{event.venue},</strong>
          <br />
          {event.location.city}
        </p>
      </div>

      <div className="info-wrapper">
            <button 
            className={`info-wrapper__cta ${openEventIds.includes(event.id) ? 'is-open' : ''}`} 
            onClick={() => toggleMoreInfo(event.id)}
            >
            More Info <span className="info-wrapper__toggle"></span>
            </button>

        {openEventIds.includes(event.id) && (
          <div className="info-wrapper__content">
            <p>{event.description}</p>

            <h3>Line Up</h3>
            {event.lineup?.map((item, index) => (
              <p key={index}>
                {item.details} {item.time && `– ${item.time}`}
              </p>
            ))}

            <h3>Tickets</h3>
            {event.ticket_types.map((ticket) => (
              <p key={ticket.id}>
                {ticket.name} : £{(ticket.price.face_value / 100).toFixed(2)}
                {ticket.sold_out && <strong> — SOLD OUT</strong>}
              </p>
            ))}
          </div>
        )}
      </div>


      <div className='card-price'>
        {event.sold_out ? (
          <span className='sold-out'>Sold Out</span>
        ) : (
          <CtaLink href={event.url}>Book now</CtaLink>
        )}


        {event.ticket_types.length > 0 && (
        <span className='card-price__amount' key={event.ticket_types[0].id}>
            £{(event.ticket_types[0].price.face_value / 100).toFixed(2)}
            {event.ticket_types[0].sold_out}
        </span>
        )}

      </div>
    </div>
  );
}

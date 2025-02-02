import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import '../share.css';

const ShareButtons = () => {
  const { weather } = useSelector((state) => state.weather);
  const isNightMode = useSelector((state) => state.theme.isNightMode);

  const getShareUrl = () => {
    if (weather) {
      const city = weather.city.name;
      const description = weather.list[0].weather[0].description;
      return `https://weather-app.example.com/?city=${city}&description=${description}`;
    }
    return '';
  };

  const shareOnFacebook = () => {
    const url = getShareUrl();
    if (!url) {
      alert('Lütfen bir şehir seçin.');
      return;
    }
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = getShareUrl();
    if (!url) {
      alert('Lütfen bir şehir seçin.');
      return;
    }
    const text = `Check out the weather in ${weather.city.name}! ${weather.list[0].weather[0].description}`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = getShareUrl();
    if (!url) {
      alert('Lütfen bir şehir seçin.');
      return;
    }
    const text = `Check out the weather in ${weather.city.name}! ${weather.list[0].weather[0].description} - ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const buttonClassName = isNightMode ? 'share-button night-mode' : 'share-button';

  return (
    <>
      <button className={buttonClassName} onClick={shareOnFacebook}>
        <FontAwesomeIcon icon={faFacebook} size="2x" />
      </button>
      <button className={buttonClassName} onClick={shareOnTwitter}>
        <FontAwesomeIcon icon={faTwitter} size="2x" />
      </button>
      <button className={buttonClassName} onClick={shareOnWhatsApp}>
        <FontAwesomeIcon icon={faWhatsapp} size="2x" />
      </button>
    </>
  );
};

export default ShareButtons;

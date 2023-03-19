import Main from "./Main";
import Header from "./Header";
import Footer from "./Footer";
import api from "../utils/Api";
import ImagePopup from "./ImagePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import { useState, useEffect } from "react";
import { CurrentUserContext } from "../context/CurrentUserContext.js";

function App() {
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [isEditPopupAvatar, setEditPopupAvatar] = useState(false);
  const [isEditPopupProfile, setEditPopupProfile] = useState(false);
  const [isEditPopupAddPlace, setEditPopupAddPlace] = useState(false);

  useEffect(() => {
    api.getInitialCards().then(setCards).catch(console.error);
    api.getUserInfo().then(setCurrentUser).catch(console.error);
  }, []);

  function handleEditAvatarClick() {
    setEditPopupAvatar(true);
  }

  function handleEditProfileClick() {
    setEditPopupProfile(true);
  }

  function handleAddPlaceClick() {
    setEditPopupAddPlace(true);
  }

  function closeAllPopups() {
    setEditPopupAvatar(false);
    setEditPopupProfile(false);
    setEditPopupAddPlace(false);
    setSelectedCard(null);
  }

  const isOpen =
    isEditPopupAvatar ||
    isEditPopupProfile ||
    isEditPopupAddPlace ||
    selectedCard;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  function stopProp(e) {
    e.stopPropagation();
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  const setNewCards = (id, newCard) => {
    setCards((state) => state.map((c) => (c._id === id ? newCard : c)));
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (isLiked) {
      api
        .deleteLikes(card._id, !isLiked)
        .then((newCard) => {
          setNewCards(card._id, newCard);
        })
        .catch(console.error);
    } else {
      api
        .putLikes(card._id, isLiked)
        .then((newCard) => {
          setNewCards(card._id, newCard);
        })
        .catch(console.error);
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => setCards((state) => state.filter((c) => c._id !== card._id)))
      .catch(console.error);
  }

  function handleUpdateUser({ name, about }) {
    api
      .patchUserInfo({ name: name, about: about })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .patchUserAvatar({ avatar: avatar })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleUpdateCard({ name, link }) {
    api
      .postCard({ name: name, link: link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(console.error);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          cards={cards}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
        <Footer />
        <EditProfilePopup
          isOpen={isEditPopupProfile}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          propagation={stopProp}
        />
        <EditAvatarPopup
          isOpen={isEditPopupAvatar}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          propagation={stopProp}
        />
        <AddPlacePopup
          isOpen={isEditPopupAddPlace}
          onClose={closeAllPopups}
          onUpdateCard={handleUpdateCard}
          propagation={stopProp}
        />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          propagation={stopProp}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

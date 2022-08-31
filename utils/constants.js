const options = { // Опции для cors
  origin: [
    'http://localhost:3000',
    'http://alvde-mesto.nomoredomains.sbs',
    'https://alvde-mesto.nomoredomains.sbs',
    'https://alvde-site.github.io',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};

const SecretKey = 'some-secret-key';

// Сообщения ошибок
const ServerCrash = 'Сервер сейчас упадёт';
const IncorrectEmailPassword = 'Вы ввели неправильный логин или пароль';
const EnterEmail = 'Введите почту';
const IncorrectLinkFormat = 'Неправильный формат ссылки';
const CanNotFind = 'Извините, я не могу это найти!';
const ServerError = 'На сервере произошла ошибка';
const AuthError = 'Нужно авторизоваться';
const IncorrectLoginPassword = 'Вы ввели неправильный логин или пароль';
const NotFoundUser = 'Пользователь по указанному_id в БД не найден';
const NotFoundMovie = 'Фильма по указанному_id в БД не найдено';
const EditProfileError = 'При обновлении профиля произошла ошибка';
const IncorrectUserData = 'Переданы некорректные данные при создании пользователя';
const IncorrectMoviesData = 'Переданы некорректные данные при создании фильма';
const UsedEmail = 'email уже занят';
const DeletedToken = 'Токен удален';
const SomethingWrong = 'Что-то пошло не так';
const ForbiddenDeleteMovie = 'Нельзя удалить фильм';
const MovieIsRemoved = 'Фильм удален';

module.exports = {
  options,
  SecretKey,
  ServerCrash,
  IncorrectEmailPassword,
  EnterEmail,
  IncorrectLinkFormat,
  CanNotFind,
  ServerError,
  AuthError,
  IncorrectLoginPassword,
  NotFoundUser,
  NotFoundMovie,
  EditProfileError,
  IncorrectUserData,
  IncorrectMoviesData,
  UsedEmail,
  DeletedToken,
  SomethingWrong,
  ForbiddenDeleteMovie,
  MovieIsRemoved,
};



#остановить публикацию об ошибках
set -e

#сборка приложения
npm run build

#переход в каталог сборки
cd dist

#инициализация репозитория и загрузка кода в гитхаб
git init
git add -A
git commit -m "deploy"

git push -f https://github.com/CorbenRF/vue-app.git master:gh-pages

cd -

CWD="$(pwd)"
TARGETS="$@"

function requested() {
  echo "$TARGETS" | tr " " '\n' | grep -F -q -x "$1"
}

function install_and_build() {
  if [ -z $TARGETS ] || requested "$1"; then
    echo "Building $1..."
    cd "$2"
    npm run build;
    cd "$CWD"
  fi
}

## Libraries
install_and_build be-auth services/@dms/auth
install_and_build be-config services/@dms/config
install_and_build be-crud services/@dms/crud
install_and_build be-persistence services/@dms/persistence

## Backend services
install_and_build be-service-token services/token
install_and_build be-service-basic-auth services/basic-auth

# FE install
# Libraries
install_and_build fe-remote-component frontend/@dms/remote-component
install_and_build fe-vite frontend/@dms/vite-plugin-remote-component

## Components
install_and_build fe-component-auth-basic-login frontend/@dms-components/auth-basic-login
install_and_build fe-test-remote-component frontend/@dms-components/test-remote-component

## Core
install_and_build fe frontend/core

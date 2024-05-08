CWD="$(pwd)"
TARGETS="$@"

function requested() {
  echo "$TARGETS" | tr " " '\n' | grep -i -q "$1"
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
install_and_build be-http services/@dms/http_base
install_and_build be-telemetry services/@dms/telemetry

## Backend services
install_and_build be-service-token services/token
install_and_build be-service-basic-auth services/basic-auth
install_and_build be-service-querier services/querier

## Core
install_and_build fe frontend

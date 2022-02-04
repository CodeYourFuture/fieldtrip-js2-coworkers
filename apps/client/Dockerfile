FROM pierrezemb/gostatic
COPY build /srv/http/
CMD ["-port","8080","-https-promote", "-enable-logging", "-fallback", "index.html"]

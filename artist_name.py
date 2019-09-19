import json


class NormalizedArtistName(object):
    def __init__(self):
        self._normalized_names = {}
        with open('normalized_artist_names.json', 'r') as fh:
            names = json.load(fh)
        for canonical_name, alternate_names in names.items():
            for alternate_name in alternate_names:
                self._normalized_names[alternate_name] = canonical_name

    def get_canonical_artist_name(self, artist_name: str) -> str:
        return self._normalized_names.get(artist_name, artist_name)

import requests
from bs4 import BeautifulSoup
import re
import json
import time


DATE_REGEX = re.compile('(\d{4}-\d{2}-\d{2})')
VENUE_REGEX = re.compile(' @ (.*) - ')
ARTIST_REGEX = re.compile(' - (.*) [-|\(]')


# mixes that should be ignored, duplicates, not actually essential mixes etc
MIXES_TO_IGNORE = [
    '/w/1998-01_-_David_Holmes_-_Essential_Mix', '/w/2000_-_Fran%C3%A7ois_K_-_Essential_Mix'
]


def parse_mix_link(link_tag):
    """
    Parses the link, date, artist names and venues (if applicable) from the mixes db link text

    :return: the link and a dictionary with the rest of the data
    """
    mix_url = link_tag.attrs['href']

    if mix_url in MIXES_TO_IGNORE:
        return None, None
    title = link_tag.attrs['title']
    title = title.replace(' - Essential Mix', '').replace('(Essential Mix)', '')

    segments = title.split(' - ')

    if len(segments[0]) == 10:
        date = segments[0]
    else:
        # missing date for venue gig, need to handle differently
        match = DATE_REGEX.search(title)
        if match:
            date = match.groups()[0]
            segments[1] = segments[1].replace('(Essential Mix, %s)' % date, '')
        else:
            date = ''

    artist_venue = segments[1].split(' @ ')
    artists = [artist.strip() for artist in artist_venue[0].split(',')]
    venue = artist_venue[1].strip() if len(artist_venue) > 1 else ''

    return mix_url, {'date': date, 'artists': artists, 'venue': venue}


def get_next_page(page_soup):
    """
    Gets the url to the next page in the category if it exists
    """
    pagination = page_soup.find(class_='listPagination')
    for navigation in pagination.findAll('a'):
        if 'next' in navigation.get_text():
            return navigation.attrs['href']
    return None


def get_session():
    session = requests.Session()
    USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.3'
    session.headers.update({
        'User-Agent': USER_AGENT,
    })
    return session

def get_tracklist_links(session):
    """
    Gets tracklist links and basic data for all the mixes in the Essential Mix category
    """
    try:
        # If a data file already exists, use that.
        with open('./data.json', 'r') as fp:
            data = json.load(fp)
    except Exception:
        next_page = True
        pages = []
        data = {}
        url = 'https://www.mixesdb.com/w/Category:Essential_Mix'

        while next_page:
            print(len(pages), url)
            response = session.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            mixes = soup.find(id='catMixesList')
            mix_links = mixes.find_all('a')

            for link in mix_links:
                try:
                    mix_url, mix_data = parse_mix_link(link)
                    if mix_url and mix_data:
                        data[mix_url] = mix_data
                except Exception as e:
                    print(link)
                    print(e)

            next_page = get_next_page(soup)
            if next_page:
                pages.append(next_page)
                url = 'https://www.mixesdb.com/%s' % next_page
            time.sleep(5)

        with open('./data.json', 'w') as fp:
            json.dump(data, fp)
    return data


def get_tracklist_data(session, url):
    """
    Get a tracklist for an individual URL
    """
    try:
        # URLS with dots in them return an error when action=raw is appended use different url structures:
        if '.' in url:
            url = url.replace('/w/', '')
            response = session.get('https://www.mixesdb.com/db/index.php?title=%s&action=raw' % url)
        else:
            response = session.get('https://www.mixesdb.com%s?action=raw' % url)
        return response.content
    except Exception as e:
        print(url)
        print(e)


def get_tracklists(session, data):
    """
    Iterate all links in data and fetch individual tracklists for all entries that don't have them
    """
    for index, (url, mix_data) in enumerate(data.items()):
        if 'tracklist' not in mix_data:
            mix_data['tracklist'] = get_tracklist_data(session, url)
            time.sleep(2)

        if index % 100 == 0:
            print('Done %d/%d' % (index, len(data.items())))

    with open('./data.json', 'w') as fp:
        json.dump(data, fp)
    return data


session = get_session()
data = get_tracklist_links(session)
data = get_tracklists(session, data)


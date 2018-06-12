import json
import logging
import time

import geocoder
import lxml.html
import requests


WITHIN_1_KM_CONFIDENCE_SCORE = 8
FORMATTING_SPACE = '  '
WAIT_TIME = 0.5

logger = logging.getLogger(__file__)
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.INFO)

locations = []
warnings = []

BASE_URL = 'http://tylercowensethnicdiningguide.com/'
page = requests.get(BASE_URL)
doc = lxml.html.fromstring(page.text)

review_links = doc.xpath('//h3[text()="Current Favorites"]/following-sibling::ul/li/div/a')
logger.info('Found {} restaurants listed on TCEDG.com'.format(len(review_links)))
for review in review_links:
    (url, ) = review.xpath('@href')
    (name, ) = review.xpath('text()')
    name = name.strip().encode('ascii', 'ignore')

    page = requests.get(url)
    doc = lxml.html.fromstring(page.text)

    # Only one restaurant has multiple addresses, so just keep the first
    addresses = doc.xpath('//a[contains(@href, "google.com/maps") and not(text()="Google")]/text()')
    address = addresses[0]

    geocoded = geocoder.google(address)
    if 'coordinates' not in geocoded.geometry:
        # Try again, using the name of the restaurant and the city-state
        city = address.split(',')[-2].strip()
        state = address.split(',')[-1].strip()
        alternative_search = '{}, {}, {}'.format(name, city, state)
        geocoded = geocoder.google(alternative_search)
    coordinates = geocoded.geometry['coordinates']

    if geocoded.confidence >= WITHIN_1_KM_CONFIDENCE_SCORE:
        logger.info(name)
        logger.info(FORMATTING_SPACE + url)
        logger.info(FORMATTING_SPACE + address)
        logger.info(FORMATTING_SPACE + str(coordinates))
        locations.append({'name': name, 'url': url, 'address': address, 'coordinates': coordinates})
    else:
        warnings.append(name)

    time.sleep(WAIT_TIME)

if warnings:
    logger.warn("Couldn't adequately geocode the following restaurants, so they were skipped")
    for restaurant in warnings:
        logger.warn(restaurant)

with open('locations.json', 'w') as file_:
    json.dump(locations, file_, ensure_ascii=False, indent=4)

import json

import geocoder
import lxml.html
import requests


WITHIN_1_KM_CONFIDENCE_SCORE = 8
FORMATTING_SPACE = '  '

locations = []
warnings = []

BASE_URL = 'http://tylercowensethnicdiningguide.com/'
page = requests.get(BASE_URL)
doc = lxml.html.fromstring(page.text)

review_links = doc.xpath('//h3[text()="Current Favorites"]/following-sibling::ul/li/a')
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
        print(name)
        print(FORMATTING_SPACE + url)
        print(FORMATTING_SPACE + address)
        print(FORMATTING_SPACE + str(coordinates))
        locations.append({'name': name, 'url': url, 'address': address, 'coordinates': coordinates})
    else:
        warnings.append(name)

if warnings:
    print("\nWARNING: Couldn't adequately geocode the following restaurants, so they were skipped")
    for restaurant in warnings:
        print(restaurant)

with open('locations.json', 'w') as file_:
    json.dump(locations, file_, ensure_ascii=False, indent=4)

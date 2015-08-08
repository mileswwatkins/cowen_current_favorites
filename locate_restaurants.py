import json

import geocoder
import lxml.html
import requests


WITHIN_1_KM_CONFIDENCE_SCORE = 8

locations = []

BASE_URL = 'http://tylercowensethnicdiningguide.com/'
page = requests.get(BASE_URL)
doc = lxml.html.fromstring(page.text)

review_links = doc.xpath('//h3[text()="Current Favorites"]/following-sibling::ul/li/a')
for review in review_links:
    (url, ) = review.xpath('@href')
    (name, ) = review.xpath('text()')

    page = requests.get(url)
    doc = lxml.html.fromstring(page.text)

    # Only one restaurant has multiple addresses, so just keep the first
    addresses = doc.xpath('//a[contains(@href, "google.com/maps") and not(text()="Google")]/text()')
    address = addresses[0]

    geocoded = geocoder.google(address)
    coordinates = geocoded.geometry['coordinates']

    if geocoded.confidence >= WITHIN_1_KM_CONFIDENCE_SCORE:
        print(name)
        print(url)
        print(address)
        print(coordinates)
        locations.append({'name': name, 'url': url, 'address': address, 'coordinates': coordinates})
    else:
        print("WARNING: Unable to properly locate {}; skipping it".format(name))

with open('locations.json', 'w') as file_:
    json.dump(locations, file_, ensure_ascii=False, indent=4)

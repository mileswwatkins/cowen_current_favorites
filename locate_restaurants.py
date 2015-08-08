import json
import io

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
    # assert geocoded.confidence >= WITHIN_1_KM_CONFIDENCE_SCORE
    coordinates = geocoded.geometry['coordinates']

    print(name)
    print(address)
    print(coordinates)
    locations.append({'name': name, 'address': address, 'coordinates': coordinates})

with io.open('locations.json', 'w', encoding='utf8') as file_:
    data = json.dumps(locations, ensure_ascii=False)
    file_.write(unicode(data))

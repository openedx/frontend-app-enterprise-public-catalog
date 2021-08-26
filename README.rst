|Build Status| |Codecov| |license|

frontend-app-enterprise-public-catalog
=================================

Introduction
------------

This application is a public facing catalog page for use by edX consumers to find courses in catalogs before deciding to enroll.

The dev server is running at `http://localhost:8735 <http://localhost:8735>`_.
The staging server is running at `https://explore-catalog.stage.edx.org/`_.

Project Structure
-----------------

The source for this project is organized into nested submodules according to the ADR `Feature-based Application Organization <https://github.com/edx/frontend-app-enterprise-public-catalog/blob/master/docs/decisions/0002-feature-based-application-organization.rst>`_.

Build Process Notes
-------------------
**Local Development** 
To run this project locally: 
1.  Clone this repository
2.  From repository root folder, run: 

``npm install``
1. This project requires Algolia developer keys. Once you have them, make the following local modifications to the .env.development file and replace the keys.

``ALGOLIA_APP_ID=''
ALGOLIA_SEARCH_API_KEY=''
ALGOLIA_INDEX_NAME=''``

You will also need to replace the following variables with valid Catalog Query UUIDs that are present in your Algolia index:
``EDX_FOR_BUSINESS_UUID=''
EDX_FOR_ONLINE_EDU_UUID=''
EDX_ENTERPRISE_ALACARTE_UUID=''``

1.  From repository root folder, run: 

``npm start``

to start your local server at `http://localhost:8735 <http://localhost:8735>`_.

**Production Build**

The production build is created with ``npm run build``.

Internationalization
--------------------

Please see `edx/frontend-platform's i18n module <https://edx.github.io/frontend-platform/module-Internationalization.html>`_ for documentation on internationalization.  The documentation explains how to use it, and the `How To <https://github.com/edx/frontend-i18n/blob/master/docs/how_tos/i18n.rst>`_ has more detail.

.. |Build Status| image:: https://api.travis-ci.com/edx/frontend-app-enterprise-public-catalog.svg?branch=master
   :target: https://travis-ci.com/edx/frontend-app-enterprise-public-catalog
.. |Codecov| image:: https://codecov.io/gh/edx/frontend-app-enterprise-public-catalog/branch/master/graph/badge.svg
   :target: https://codecov.io/gh/edx/frontend-app-enterprise-public-catalog
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-app-enterprise-public-catalog.svg
   :target: @edx/frontend-app-enterprise-public-catalog

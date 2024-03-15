|Build Status| |Codecov| |license|

frontend-app-enterprise-public-catalog
======================================

Introduction
------------

This application is a public facing catalog page for use by edX consumers to find courses in catalogs before deciding to enroll.

The dev server is running at `http://localhost:8735 <http://localhost:8735>`_.
The staging server is running at `https://explore-catalog.stage.edx.org/ <https://explore-catalog.stage.edx.org/>`_.

Project Structure
-----------------

The source for this project is organized into nested submodules according to the ADR `Feature-based Application Organization <https://github.com/openedx/frontend-app-enterprise-public-catalog/blob/master/docs/decisions/0002-feature-based-application-organization.rst>`_.

Build Process Notes
-------------------
**Local Development**

To run this project locally:

1. Clone this repository

2. From repository root folder, run:

   ``npm install``

   Note: locally this app will default to open edX branding, so colors and formatting might look a little different than what will be deployed. To combat this, you can optionally run:

   ``npm install --save @edx/brand@npm:@edx/brand-edx.org``

3. This project requires Algolia developer keys. Once you have them, make the following local modifications to the ``.env.development`` file and replace the keys:

   .. code-block::

      ALGOLIA_APP_ID=''
      ALGOLIA_SEARCH_API_KEY=''
      ALGOLIA_INDEX_NAME=''

4. You will also need to replace the following variables with valid Catalog Query Titles that are present in your Algolia index:

   .. code-block::

      EDX_FOR_SUBSCRIPTION_TITLE='' # default = 'Subscription'
      EDX_ENTERPRISE_ALACARTE_TITLE='' # default = 'A la carte'

5. From repository root folder, run:

   ``npm start``

   to start your local server at `http://localhost:8735 <http://localhost:8735>`_.

**Helpful Testing Commands**

* ``npm run tests``
* ``npm run lint``
* ``npm run lint:fix`` to automatically fix errors

**Production Build**

The production build is created with ``npm run build``.

Internationalization
--------------------

Please see `edx/frontend-platform's i18n module <https://edx.github.io/frontend-platform/module-Internationalization.html>`_ for documentation on internationalization.  The documentation explains how to use it, and the `How To <https://github.com/openedx/frontend-i18n/blob/master/docs/how_tos/i18n.rst>`_ has more detail.

.. |Build Status| image:: https://api.travis-ci.com/edx/frontend-app-enterprise-public-catalog.svg?branch=master
   :target: https://travis-ci.com/edx/frontend-app-enterprise-public-catalog
.. |Codecov| image:: https://codecov.io/gh/edx/frontend-app-enterprise-public-catalog/branch/master/graph/badge.svg
   :target: https://codecov.io/gh/edx/frontend-app-enterprise-public-catalog
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-app-enterprise-public-catalog.svg
   :target: @edx/frontend-app-enterprise-public-catalog

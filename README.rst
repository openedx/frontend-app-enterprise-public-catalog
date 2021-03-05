|Build Status| |Codecov| |license|

frontend-app-enterprise-public-catalog
=================================

Introduction
------------

This application is a public facing catalog page for use by edX consumers to find courses in catalogs before deciding to enroll.

The dev server is running at `http://localhost:8735 <http://localhost:8735>`_.

Project Structure
-----------------

The source for this project is organized into nested submodules according to the ADR `Feature-based Application Organization <https://github.com/edx/frontend-app-enterprise-public-catalog/blob/master/docs/decisions/0002-feature-based-application-organization.rst>`_.

Build Process Notes
-------------------

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

#!/usr/bin/env python3
# -*- encoding:utf-8 -*-
# Database operation, currently for sqlite 3
#
#   wlan-phishing-ynu
#   Copyright (C) 2019 kmahyyg
#   This program is free software: you can redistribute it and/or modify
#   it under the terms of the GNU Affero General Public License as published by
#   the Free Software Foundation, either version 3 of the License, or
#   (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU Affero General Public License for more details.
#
#   You should have received a copy of the GNU Affero General Public License
#   along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

from sqlalchemy import create_engine, Column
from sqlalchemy.schema import MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import *
from apikey import *
from sqlalchemy.dialects.sqlite import BOOLEAN, VARCHAR, INTEGER, TIMESTAMP

Base = declarative_base()


class UniqT(Base):
    __tablename__ = 'uniquser'

    id = Column('id', INTEGER, primary_key=True, autoincrement=True)
    usrname = Column('username', VARCHAR(50), nullable=False)
    passwd = Column('password', VARCHAR(50), nullable=False)
    time = Column('timest', TIMESTAMP(timezone=True), nullable=False, default=func.now())
    validated = Column('legal', BOOLEAN, nullable=True)


class SrunT(Base):
    __tablename__ = 'webuser'

    id = Column('id', INTEGER, primary_key=True, autoincrement=True)
    usrname = Column('username', VARCHAR(50), nullable=False)
    passwd = Column('password', VARCHAR(50), nullable=False)
    time = Column('timest', TIMESTAMP(timezone=True), nullable=False, default=func.now())
    validated = Column('legal', BOOLEAN, nullable=True)


def conn2db():
    engine = create_engine(dev_dbconn, pool_pre_ping=True)
    dbsess = sessionmaker(bind=engine)
    sess = dbsess()
    return sess


def dbexit(session):
    session.commit()
    session.close()
    return 0

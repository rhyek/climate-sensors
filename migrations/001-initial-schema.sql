-- Up
create table sensors (
  id integer primary key,
  serialNo text unique
);

create table readings (
  id integer primary key,
  sensor_id integer not null references sensors,
  temperature decimal(10, 5) not null,
  humidity decimal(10, 5) not null
);

insert into sensors (serialNo) values ('1'), ('2');

-- Down

drop table readings;
drop table sensors;
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { v4 } from 'uuid';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      enableDebugMessages: true,
      skipUndefinedProperties: false,
      skipNullProperties: false,
      skipMissingProperties: false,
    }));
    await app.init();
  });

  it('No exising messages', async() => {
    const result = await request(app.getHttpServer()).get('/messages');
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body).toEqual({ "message": null, "messagesLeft": 0 });
  });


  it('Create new message / retrive / read receipt', async () => {
    const id = v4();
    const ts = new Date().toISOString();
    let result = await request(app.getHttpServer()).post('/messages').type('form')
      .send({
        id: id,
        timestamp: ts,
        payload: JSON.stringify({ a: 1 })
      });
    expect(result.status).toBe(HttpStatus.CREATED);


    result = await request(app.getHttpServer()).post('/messages').type('form')
      .send({
        id: v4(),
        timestamp: new Date().toISOString(),
        payload: JSON.stringify({ a: 2 })
      });
    expect(result.status).toBe(HttpStatus.CREATED);

    result = await request(app.getHttpServer()).get('/messages');
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.body).toEqual({
      "message": {
        id,
        timestamp: ts,
        payload:JSON.stringify({ a: 1 })
      }, "messagesLeft": 1
    });

    result = await request(app.getHttpServer()).patch(`/messages/${id}`);
    expect(result.status).toBe(HttpStatus.OK);

    result = await request(app.getHttpServer()).patch(`/messages/${id}`);
    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(JSON.parse(result.text)).toStrictEqual({ "statusCode": 400, "message": `Invalid message id: ${id}`, "error": "Bad Request" });
  });

  it('should fail for bad requests', async () => {
    let result = await request(app.getHttpServer()).post('/messages').type('form')
    .send({
      id: 123,
      timestamp: new Date().toISOString(),
      payload: JSON.stringify({ a: 3 })
    });
    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(JSON.parse(result.text)).toStrictEqual({ "statusCode": 400, "message": ["id must be a UUID"], "error": "Bad Request" });


    result = await request(app.getHttpServer()).post('/messages')
    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(JSON.parse(result.text)).toStrictEqual({ "statusCode": 400, "message": ["id must be a UUID", "timestamp must be a valid ISO 8601 date string", "payload must be a json string"], "error": "Bad Request" });

    result = await request(app.getHttpServer()).post('/messages').type('form')
    .send({
      id: v4(),
      timestamp: new Date().toISOString(),
      payload: 123
    });
    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(JSON.parse(result.text)).toStrictEqual({ "statusCode": 400, "message": ["payload must be a json string"], "error": "Bad Request" });
  });
});

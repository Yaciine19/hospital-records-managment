import 'package:meta/meta.dart';

@sealed
class Unit {
  const Unit._();
}

const Unit unit = Unit._();

sealed class Result<S, F> {
  bool isSuccess();
  bool isFailure();

  W match<W>(W Function(S data) onSuccess, W Function(F error) onFailure);

  Result<S, F> onSuccess(void Function(S success) onSuccess);
  Result<S, F> onFailure(void Function(F failure) onFailure);

  Result<W, F> map<W>(W Function(S) onSuccess);
  Result<S, E> mapFailure<E>(E Function(F) onError);

  S successOr(S or);
  F failureOr(F or);

  S? successOrNull();
  F? failureOrNull();

  S successOrThrow();
  F failureOrThrow();
}

class Success<S, F> extends Result<S, F> {
  final S _value;
  Success(this._value);

  @override
  bool isFailure() => false;

  @override
  bool isSuccess() => true;

  @override
  W match<W>(W Function(S data) onSuccess, W Function(F error) onFailure) =>
      onSuccess(_value);

  @override
  Result<W, F> map<W>(W Function(S p1) onSuccess) => Success(onSuccess(_value));
  @override
  Result<S, E> mapFailure<E>(E Function(F p1) onError) => Success<S, E>(_value);

  @override
  Result<S, F> onFailure(void Function(F failure) onFailure) => this;
  @override
  Result<S, F> onSuccess(void Function(S success) onSuccess) {
    onSuccess(_value);
    return this;
  }

  @override
  F failureOr(F or) => or;
  @override
  F? failureOrNull() => null;
  @override
  F failureOrThrow() => throw Exception("Result is success");

  @override
  S successOr(S or) => _value;
  @override
  S? successOrNull() => _value;
  @override
  S successOrThrow() => _value;
}

class Failure<S, F> extends Result<S, F> {
  final F _error;
  Failure(this._error);

  @override
  bool isFailure() => true;

  @override
  bool isSuccess() => false;

  @override
  W match<W>(W Function(S data) onSuccess, W Function(F error) onFailure) =>
      onFailure(_error);

  @override
  Result<W, F> map<W>(W Function(S p1) onSuccess) => Failure(_error);

  @override
  Result<S, E> mapFailure<E>(E Function(F p1) onError) =>
      Failure<S, E>(onError(_error));

  @override
  Result<S, F> onFailure(void Function(F failure) onFailure) {
    onFailure(_error);
    return this;
  }

  @override
  Result<S, F> onSuccess(void Function(S success) onSuccess) => this;

  @override
  F failureOr(F or) => _error;
  @override
  F? failureOrNull() => _error;
  @override
  F failureOrThrow() => _error;

  @override
  S successOr(S or) => or;
  @override
  S? successOrNull() => null;
  @override
  S successOrThrow() => throw Exception("Result is Failure");
}
